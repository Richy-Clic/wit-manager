import PropTypes from 'prop-types';
import { Typography } from "@mui/material";

const PageTitle = ({ children }) => (
  <Typography variant="h4" fontWeight={600}>
    {children}
  </Typography>
);

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageTitle;