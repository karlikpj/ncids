import Component from '@nciocpl/ncids-twig/components/usa-summary-box/usa-summary-box.twig';
import USAList from '@nciocpl/ncids-twig/components/usa-list/usa-list.twig?twig';
import css from './index.scss?inline';

export default {
	title: 'Components/Summary Box/Default',
	component: Component,
	parameters: { css },
};

export const Default = {
	args: {
		heading: 'Key Information',
		content: USAList({
			items: [
				"If you are under a winter storm warning, <a class='usa-summary-box__link' href='#'>find shelter</a> right away.",
				"Sign up for <a class='usa-summary-box__link' href='#'>your community's warning system</a>.",
				"Learn the signs of, and basic treatments for, <a class='usa-summary-box__link' href='#'>frostbite</a> and <a class='usa-summary-box__link' href='#'>hypothermia</a>.",
				"Gather emergency supplies for your <a class='usa-summary-box__link' href='#'>home</a> and your <a class='usa-summary-box__link' href='#'>car</a>.",
			],
		}),
	}
};
