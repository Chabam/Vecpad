import React from 'react';

// A simple component used to increase verbosity.
const Timeline = ({children}) => {
	return <div id="timeline">
		{children}
	</div>;
};

export default Timeline;