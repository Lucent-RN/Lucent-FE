import React from 'react';

interface SectionTitleProps {
  children: React.ReactElement;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  const childClassName =
    children.props &&
    typeof children.props === 'object' &&
    'className' in children.props
      ? children.props.className
      : '';
  return React.cloneElement(children, {
    className: `${childClassName} text-3xl lg:text-5xl lg:leading-tight font-bold`
  } as React.HTMLAttributes<HTMLElement>);
};

export default SectionTitle;
