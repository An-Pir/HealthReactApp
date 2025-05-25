import React from 'react';

const Label = ({text, className=''}) => {
    return (
        <label className={`${className} block mb-1 border-b-2 border-green text-green font-bold `}>
            {text}
        </label>
    );
};

export default Label;