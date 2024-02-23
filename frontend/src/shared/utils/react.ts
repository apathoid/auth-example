import React from 'react';


/** React.memo that does not lose generic types. */
export const memo: <T>(t: T) => T = React.memo;
