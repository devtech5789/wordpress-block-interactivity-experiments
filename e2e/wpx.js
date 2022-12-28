import { wpx } from '../src/runtime/wpx';

wpx({
	state: {
		trueValue: true,
		falseValue: false,
	},
	actions: {
		toggleTrueValue: ({ state }) => {
			state.trueValue = !state.trueValue;
		},
		toggleFalseValue: ({ state }) => {
			state.falseValue = !state.falseValue;
		},
		toggleContextFalseValue: ({ context }) => {
			context.falseValue = !context.falseValue;
		},
	},
});
