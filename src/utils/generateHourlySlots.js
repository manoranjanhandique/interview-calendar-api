const generateHourlySlots = (startTime, endTime) => {
    const slots = [];
    let current = new Date(startTime);

    while (current < new Date(endTime)) {
        const next = new Date(current);
        next.setHours(current.getHours() + 1);

        if (next <= new Date(endTime)) {
            slots.push({
                startTime: new Date(current),
                endTime: new Date(next),
            });
        }

        current = next;
    }

    return slots;
};

module.exports={generateHourlySlots}