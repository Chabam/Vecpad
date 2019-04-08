import React from 'react';

// A simple component used to increase verbosity.
const Sidebar = ({children}) => {
	return <nav id="sidebar">
		{children}
	</nav>;
};

export default Sidebar;