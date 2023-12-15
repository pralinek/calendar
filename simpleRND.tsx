import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const ResizableBox = () => {
    const containerHeight = 500; // Height of the larger box
    const [smallBoxHeight, setSmallBoxHeight] = useState(containerHeight * 0.5); // Initial height of the smaller box, 50% of the container

    return (
        <div style={{ width: '100%', height: `${containerHeight}px`, position: 'relative', border: '1px solid black' }}>
            <Rnd
                size={{ width: '100%', height: smallBoxHeight }}
                position={{ x: 0, y: 0 }}
                onDragStop={(e, d) => setSmallBoxHeight(d.y + smallBoxHeight)}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setSmallBoxHeight(parseFloat(ref.style.height));
                }}
                enableResizing={{
                    top: true,
                    right: false,
                    bottom: true,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false
                }}
                dragAxis="y"
                style={{ border: '1px solid blue' }}
            >
                <div style={{ height: '100%', backgroundColor: 'lightblue' }}>Small Box</div>
            </Rnd>
        </div>
    );
};

export default ResizableBox;