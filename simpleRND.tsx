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

        let newX = Math.round(d.x / 20) * 20; // Snap to 20px grid

        // Prevent moving box outside the container
        newX = Math.max(0, newX);
        newX = Math.min(newX, window.innerWidth - currentBox.width);

        // Maintain the box order
        const index = boxes.findIndex(box => box.id === id);
        if (index > 0) {
            const previousBox = boxes[index - 1];
            newX = Math.max(newX, previousBox.x + previousBox.width);
        }
        if (index < boxes.length - 1) {
            const nextBox = boxes[index + 1];
            newX = Math.min(newX, nextBox.x - currentBox.width);
        }

        updateBox(id, newX, currentBox.width);
    };

    const onResizeStop = (id: number, ref: any, position: any, delta: any) => {
        const currentBox = boxes.find(box => box.id === id);
        if (!currentBox) return;

        let newWidth = ref.offsetWidth;

        // Prevent resizing box outside the container
        newWidth = Math.min(newWidth, window.innerWidth - currentBox.x);

        // Maintain the box order
        const index = boxes.findIndex(box => box.id === id);
        if (index < boxes.length - 1) {
            const nextBox = boxes[index + 1];
            newWidth = Math.min(newWidth, nextBox.x - currentBox.x);
        }

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
