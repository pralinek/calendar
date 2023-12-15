import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const initialBoxes = [
    { id: 1, width: 100, x: 0, color: 'lightblue' },
    { id: 2, width: 150, x: 100, color: 'lightgreen' },
    { id: 3, width: 200, x: 250, color: 'lightcoral' },
];

const ResizableBox = () => {
    const containerHeight = 200; // Height of the container
    const [boxes, setBoxes] = useState(initialBoxes);

    const updateBox = (id, newX, newWidth) => {
        setBoxes(currentBoxes =>
            currentBoxes.map(box => 
                box.id === id ? { ...box, x: newX, width: newWidth } : box
            )
        );
    };

    const onDragStop = (id, d) => {
        // Find the current box and its neighbors
        const currentBox = boxes.find(box => box.id === id);
        const leftNeighbor = boxes.find(box => box.x + box.width === currentBox.x);
        const rightNeighbor = boxes.find(box => currentBox.x + currentBox.width === box.x);

        // Calculate new position
        let newX = d.x;

        // Prevent overlap with neighbors
        if (leftNeighbor) {
            newX = Math.max(newX, leftNeighbor.x + leftNeighbor.width);
        }
        if (rightNeighbor) {
            newX = Math.min(newX, rightNeighbor.x - currentBox.width);
        }

        // Update the box position
        updateBox(id, newX, currentBox.width);
    };

    const onResizeStop = (id, ref, position, delta) => {
        // Find the current box and its right neighbor
        const currentBox = boxes.find(box => box.id === id);
        const rightNeighbor = boxes.find(box => currentBox.x + currentBox.width + delta.width <= box.x);

        // Calculate new width
        let newWidth = ref.offsetWidth;

        // Prevent overlap with the right neighbor
        if (rightNeighbor) {
            newWidth = Math.min(newWidth, rightNeighbor.x - currentBox.x);
        }

        // Update the box size
        updateBox(id, currentBox.x, newWidth);
    };

    return (
        <div style={{ width: '100%', height: `${containerHeight}px`, position: 'relative', border: '1px solid black', overflow: 'hidden' }}>
            {boxes.map((box) => (
                <Rnd
                    key={box.id}
                    size={{ width: box.width, height: containerHeight }}
                    position={{ x: box.x, y: 0 }}
                    onDragStop={(e, d) => onDragStop(box.id, d)}
                    onResizeStop={(e, direction, ref, delta, position) => onResizeStop(box.id, ref, position, delta)}
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
