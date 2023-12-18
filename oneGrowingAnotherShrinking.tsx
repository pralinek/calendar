import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface Box {
    id: number;
    width: number;
    x: number;
    color: string;
}

const initialBoxes: Box[] = [
    { id: 1, width: 100, x: 0, color: 'lightblue' },
    { id: 2, width: 150, x: 100, color: 'lightgreen' },
    { id: 3, width: 200, x: 250, color: 'lightcoral' },
];

const ResizableBox: React.FC = () => {
    const containerHeight = 200;
    const containerWidth = window.innerWidth; // Assuming full window width for container
    const [boxes, setBoxes] = useState<Box[]>(initialBoxes);

    const updateBox = (updatedBoxes: Box[]) => {
        setBoxes(updatedBoxes);
    };

    const onResizeStop = (id: number, ref: any, position: any, delta: any) => {
        const currentBoxIndex = boxes.findIndex(box => box.id === id);
        if (currentBoxIndex === -1) return;

        let newBoxes = [...boxes];
        let currentBox = newBoxes[currentBoxIndex];
        let newWidth = Math.min(currentBox.width + delta.width, containerWidth - currentBox.x);
        newWidth = Math.max(newWidth, 20); // Minimum width to avoid boxes disappearing

        // Adjust the width of the next box
        if (currentBoxIndex < newBoxes.length - 1) {
            let nextBox = newBoxes[currentBoxIndex + 1];
            let combinedWidth = currentBox.width + nextBox.width;
            nextBox.width = combinedWidth - newWidth;
            nextBox.x = currentBox.x + newWidth;
        }

        currentBox.width = newWidth;

        // Update all boxes to maintain the total width
        let totalWidth = newBoxes.reduce((acc, box) => acc + box.width, 0);
        if (totalWidth < containerWidth) {
            if (currentBoxIndex < newBoxes.length - 1) {
                newBoxes[newBoxes.length - 1].width += containerWidth - totalWidth;
            }
        }

        updateBox(newBoxes);
    };

    return (
        <div style={{ width: `${containerWidth}px`, height: `${containerHeight}px`, position: 'relative', border: '1px solid black', overflow: 'hidden' }}>
            {boxes.map((box) => (
                <Rnd
                    key={box.id}
                    size={{ width: box.width, height: containerHeight }}
                    position={{ x: box.x, y: 0 }}
                    onResizeStop={(e, direction, ref, delta, position) => onResizeStop(box.id, ref, position, delta)}
                    enableResizing={{
                        top: false,
                        right: currentBoxIndex < boxes.length - 1,
                        bottom: false,
                        left: currentBoxIndex > 0,
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
