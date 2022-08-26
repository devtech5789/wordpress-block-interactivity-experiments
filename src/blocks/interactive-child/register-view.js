import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import registerBlockView from '../../gutenberg-packages/register-block-view';
import View from './view';

setTimeout(() => {
	registerBlockView('bhe/interactive-child', View, {
		usesContext: [ThemeContext, CounterContext],
	});
}, 3000);