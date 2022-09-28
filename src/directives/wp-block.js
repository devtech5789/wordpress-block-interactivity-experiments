import { useMemo, useContext } from 'preact/hooks';
import blockContext from './block-context';
import { createGlobal, matcherFromSource } from '../gutenberg-packages/utils';
import { directive } from '../gutenberg-packages/directives';

const blockViews = createGlobal('blockViews', new Map());

// Return an object of camelCased CSS properties.
const cssObject = (cssText) => {
	if (!cssText) return {};

	const el = document.createElement('div');
	const { style } = el;
	style.cssText = cssText;

	const output = {};
	for (let i = 0; i < style.length; i += 1) {
		const key = style.item(0);
		output[toCamelCase(key)] = style.getPropertyValue(key);
	}

	el.remove();
	return output;
};

const toCamelCase = (str) =>
	str.replace(/-(.)/g, (_, initial) => initial.toUpperCase());

// Handle block components.
directive('blockType', (wp, props, { vnode }) => {
	const {
		blockType,
		blockAttributes,
		blockSourcedAttributes,
		blockUsesBlockContext,
		blockProps,
		innerBlocks,
		initialRef,
	} = wp;

	props.blockProps = useMemo(
		() => ({
			style: cssObject(blockProps.style),
			className: blockProps.class,
		}),
		[blockProps.class, blockProps.style]
	);

	if (!vnode._blockAttributes) {
		vnode._blockAttributes = blockAttributes || {};
		useMemo(() => {
			for (const attr in blockSourcedAttributes) {
				vnode._blockAttributes[attr] = matcherFromSource(
					blockSourcedAttributes[attr]
				)(initialRef);
			}
		}, [blockAttributes, blockSourcedAttributes]);
	}
	props.attributes = vnode._blockAttributes;

	// TODO: Replace with `lazy()` to pause hydration until the component is
	// downloaded.
	if (!blockViews.has(blockType)) return;

	const { Component } = blockViews.get(blockType);

	if (blockUsesBlockContext.length) {
		const allContexts = useContext(blockContext);

		// Filter and memoize the attributes that are needed.
		props.context = useMemo(
			() =>
				blockUsesBlockContext.reduce((ctx, attribute) => {
					const value = allContexts[attribute];
					if (value) ctx[attribute] = value;
					return ctx;
				}, {}),
			blockUsesBlockContext.map((attribute) => allContexts[attribute])
		);
	}

	return <Component {...props}>{innerBlocks}</Component>;
});
