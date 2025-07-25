import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Card } from "components/ui";
import { LAYOUT_TYPE_MODERN } from "constants/theme.constant";
import { useSelector } from "react-redux";

const AdaptableCard = props => {
  const {
    className,
    children,
    bodyClass,
    leftSideBorder,
    rightSideBorder,
    divider,
    shadow,
    isLastChild,
    ...rest
  } = props;

  const type = useSelector(state => state.theme.layout.type);

  return (
    <Card
      className={classNames(
        className,
        type === LAYOUT_TYPE_MODERN && "border-0",
        type === LAYOUT_TYPE_MODERN &&
          rightSideBorder &&
          "ltr:border-r-0 rtl:border-l-0 ltr:md:border-r rtl:md:border-l md:border-gray-200 md:dark:border-gray-600 rounded-tr-none rounded-br-none rtl:rounded-tr-none rtl:rounded-br-none",
        type === LAYOUT_TYPE_MODERN &&
          leftSideBorder &&
          "ltr:border-l-0 rtl:border-r-0 ltr:md:border-l rtl:md:border-r md:border-gray-200 md:dark:border-gray-600 rounded-tl-none rounded-bl-none rtl:rounded-tl-none rtl:rounded-bl-none",
        type === LAYOUT_TYPE_MODERN &&
          divider &&
          `${!isLastChild ? "border-b pb-6" : ""} py-4 md:border-gray-200 md:dark:border-gray-600 rounded-br-none rounded-bl-none`,
        type !== LAYOUT_TYPE_MODERN &&
          shadow &&
          "rounded-none shadow-none border-0"
      )}
      {...rest}
      bodyClass={classNames(
        type === LAYOUT_TYPE_MODERN ? "card-gutterless" : "",
        bodyClass
      )}
    >
      {children}
    </Card>
  );
};

AdaptableCard.propTypes = {
  leftSideBorder: PropTypes.bool,
  rightSideBorder: PropTypes.bool,
  divider: PropTypes.bool,
  shadow: PropTypes.bool,
  isLastChild: PropTypes.bool
};

export default AdaptableCard;
