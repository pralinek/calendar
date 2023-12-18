import React from 'react';

const Timeline: React.FC<TimelineProps> = ({ startDate, endDate, shifts, timezone }) => {
    const totalDurationHours = dayjs(endDate).tz(timezone).diff(dayjs(startDate).tz(timezone), 'hour');
    const hourWidth = 60; // Width in pixels for each hour

    const calculatePosition = (date: Date) => {
        const hoursFromStart = dayjs(date).tz(timezone).diff(dayjs(startDate).tz(timezone), 'hour');
        return hoursFromStart * hourWidth;
    };

    const calculateWidth = (start: Date, end: Date) => {
        const durationHours = dayjs(end).tz(timezone).diff(dayjs(start).tz(timezone), 'hour');
        return durationHours * hourWidth;
    };

    return (
        <div style={{ width: `${totalDurationHours * hourWidth}px`, position: 'relative' }}>
            {shifts.map(shift => (
                <div
                    key={shift.id}
                    style={{
                        position: 'absolute',
                        left: `${calculatePosition(shift.startTime)}px`,
                        width: `${calculateWidth(shift.startTime, shift.endTime)}px`,
                        top: '0',
                        height: '100%',
                        backgroundColor: shift.color
                    }}
                />
            ))}
        </div>
    );
};

export default Timeline;
