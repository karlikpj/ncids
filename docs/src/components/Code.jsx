// Note this code was borrowed heavily from Github's Primer documentations site.
// https://github.com/primer/doctocat
import React, { useState } from 'react';
import PropType from 'prop-types';
import CopyToClipboard from './CopyToClipboard';
import { Highlight } from 'prism-react-renderer';
import Prism from '../prism';
import htmlReactParser from 'html-react-parser';
import theme from './CodeTheme';

const removeNewlines = (string) => string.replace(/(\r\n|\n|\r)/gm, '');
const wrapWithFragment = (jsx) => `<React.Fragment>${jsx}</React.Fragment>`;

const htmlToJsx = (html) => {
	try {
		const reactElement = htmlReactParser(removeNewlines(html));
		// The output of htmlReactParser could be a single React element
		// or an array of React elements. reactElementToJsxString does not accept arrays
		// so we have to wrap the output in React fragment.
		return <>{reactElement}</>;
	} catch (error) {
		return wrapWithFragment(html);
	}
};

/**
 * This is a helper function to render the Code Preview.
 */
const getPreview = (language, code, previewId) => {
	switch (language) {
		case 'html': {
			return (
				<>
					<div className="site-code-preview__heading">Component Preview</div>
					<ncids-code-preview
						id={previewId}
						class="site-code-preview__showcase">
						{htmlToJsx(code)}
					</ncids-code-preview>
				</>
			);
		}
	}
};

/**
 * This is a helper function to clean up the code for display in prism.
 * @param {language} type the type of the code
 * @param {unknown} code the code to clean up
 */
const cleanCodeForHighlighting = (language, code) => {
	// Replace tabs with spaces so the prism display is not weird.
	const tmpCode = code.toString().replaceAll('\t', '  ');

	switch (language) {
		case 'html': {
			// The silly linter wants our HTML in frontmatter to have className because react.
			return tmpCode.replaceAll('className', 'class');
		}
		default: {
			return tmpCode;
		}
	}
};

const Code = ({
	className = '/language-/js',
	nopreview = false,
	noCode = false,
	inline = false,
	children,
	...addlProps
}) => {
	// handle expanded state
	//const [codeHeight, setCodeHeight] = useState(0);

	const [isExpanded, setIsExpanded] = useState(false);

	const language = className ? className.replace(/language-/, '') : '';
	const code = children.trim();

	//check to see if code is more than 5 lines, triggering 'show more' functionality
	const isExpandable =
		Array.isArray(code.match(/\n/g)) && code.match(/\n/g).length > 6;

	const [previewId] = useState(
		'preview-' + Math.random().toString(36).substr(2, 9)
	);

	const handleShowMoreToggle = () => {
		setIsExpanded(!isExpanded);
	};

	if (inline) {
		const inlineClass = className
			? `site-inline-code ${className}`
			: 'site-inline-code';
		return (
			<code className={inlineClass} {...addlProps}>
				{children}
			</code>
		);
	}

	const codeForHighlighting = cleanCodeForHighlighting(language, code);

	return (
		<div className={`site-code-preview ${noCode ? 'no-code' : ''}`}>
			{!nopreview &&
				language === 'html' &&
				getPreview(language, code, previewId)}
			<div
				id={'site-' + previewId}
				className={`site-code-preview__code-wrap
            ${isExpandable ? 'expandable' : ''}
            ${isExpandable && isExpanded ? 'expanded' : ' '}
            `}>
				<Highlight
					prism={Prism}
					theme={theme}
					code={codeForHighlighting}
					language={language}>
					{({ className, style, tokens, getLineProps, getTokenProps }) => (
						<>
							<CopyToClipboard value={codeForHighlighting} />
							{/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
							<pre className={className} style={style} tabIndex={0}>
								{tokens.map((line, i) => (
									<div key={i} {...getLineProps({ line, key: i })}>
										{line.map((token, key) => (
											<span key={key} {...getTokenProps({ token, key })} />
										))}
									</div>
								))}
							</pre>
						</>
					)}
				</Highlight>
			</div>
			{isExpandable && (
				<div className="site-code-preview__show-more-toggle">
					<button
						aria-controls={'site-' + previewId}
						aria-expanded={isExpanded}
						type="button"
						onClick={handleShowMoreToggle}
						className="usa-button site-code-preview__show-more-toggle-btn">
						Show {isExpanded ? 'Less' : 'More'}
					</button>
				</div>
			)}
		</div>
	);
};

Code.propTypes = {
	className: PropType.string,
	nopreview: PropType.bool,
	noCode: PropType.bool,
	inline: PropType.bool,
	children: PropType.string,
};
export default Code;
