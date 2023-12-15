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
    const containerHeight = 200; // Height of the container
    const [boxes, setBoxes] = useState<Box[]>(initialBoxes);

    const updateBox = (id: number, newX: number, newWidth: number) => {
        setBoxes(currentBoxes =>
            currentBoxes.map(box => 
                box.id === id ? { ...box, x: newX, width: newWidth } : box
            )
        );
    };

    const onDragStop = (id: number, d: any) => {
        const currentBox = boxes.find(box => box.id === id);
        if (!currentBox) return;

        let newX = Math.round(d.x / 20) * 20; // Adjusting to nearest 20px grid

        // Adjust if overlapping after drag
        boxes.forEach(otherBox => {
            if (otherBox.id !== id) {
                if (newX < otherBox.x + otherBox.width && newX + currentBox.width > otherBox.x) {
                    if (otherBox.x + otherBox.width - newX < newX + currentBox.width - otherBox.x) {
                        newX = otherBox.x + otherBox.width; // Adjust to the right
                    } else {
                        newX = otherBox.x - currentBox.width; // Adjust to the left
                    }
                }
            }
        });

        updateBox(id, newX, currentBox.width);
    };

    const onResizeStop = (id: number, ref: any, position: any, delta: any) => {
        const currentBox = boxes.find(box => box.id === id);
        if (!currentBox) return;

        let newWidth = ref.offsetWidth;

        // Adjust if overlapping after resize
        boxes.forEach(otherBox => {
            if (otherBox.id !== id) {
                if (currentBox.x + newWidth > otherBox.x && currentBox.x < otherBox.x) {
                    newWidth = otherBox.x - currentBox.x; // Resize to avoid overlap
                }
            }
        });

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
