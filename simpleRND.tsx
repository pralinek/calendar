import React from 'react';
import { Rnd } from 'react-rnd';

const ResizableBox = () => {
    const containerHeight = 200; // Example height of the container
    const smallerBoxes = [
        { id: 1, width: '10%', color: 'lightblue' },
        { id: 2, width: '15%', color: 'lightgreen' },
        { id: 3, width: '20%', color: 'lightcoral' },
        // Add more boxes as needed
    ];

    return (
        <div style={{ width: '100%', height: `${containerHeight}px`, position: 'relative', border: '1px solid black', overflow: 'hidden' }}>
            {smallerBoxes.map((box) => (
                <Rnd
                    key={box.id}
                    default={{
                        x: 0,
                        y: 0,
                        width: box.width,
                        height: containerHeight
                    }}
                    enableResizing={{
                        top: false,
                        right: true,
                        bottom: false,
                        left: true,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false
                    }}
                    dragAxis="x"
                    bounds="parent"
                    style={{ backgroundColor: box.color }}
                />
            ))}
        </div>
    );
};

export default ResizableBox;