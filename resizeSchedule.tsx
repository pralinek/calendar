interface Shift {
    id: number;
    startTime: Date;
    endTime: Date;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

interface FormData {
    startTime: Date;
    endTime: Date;
}


import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useForm, SubmitHandler } from 'react-hook-form';

const Schedule: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

    const onAddShift: SubmitHandler<FormData> = data => {
        const newShift: Shift = {
            id: shifts.length,
            startTime: data.startTime,
            endTime: data.endTime,
            position: { x: 0, y: 0 }, // Initial position
            size: { width: 200, height: calculateHeight(data.startTime, data.endTime) } // Calculate height based on time
        };
        setShifts([...shifts, newShift]);
    };

    const calculateHeight = (startTime: Date, endTime: Date): number => {
        // Calculate height based on the difference between startTime and endTime
        const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Difference in hours
        return diff * 50; // 50px per hour, for example
    };

    const updateShift = (id: number, size: { width: string; height: string }, position: { x: number; y: number }) => {
        setShifts(shifts.map(shift =>
            shift.id === id ? { ...shift, size, position } : shift
        ));
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onAddShift)}>
                {/* Add form fields here */}
                <input {...register("startTime")} type="datetime-local" />
                <input {...register("endTime")} type="datetime-local" />
                <input type="submit" value="Add Shift" />
            </form>
            <div>
                {shifts.map((shift) => (
                    <Rnd
                        key={shift.id}
                        size={{ width: shift.size.width, height: shift.size.height }}
                        position={{ x: shift.position.x, y: shift.position.y }}
                        onDragStop={(e, d) => updateShift(shift.id, shift.size, d)}
                        onResizeStop={(e, direction, ref, delta, position) =>
                            updateShift(shift.id, { width: ref.style.width, height: ref.style.height }, position)
                        }
                    >
                        Shift: {shift.id}
                    </Rnd>
                ))}
            </div>
        </div>
    );
};

export default Schedule;