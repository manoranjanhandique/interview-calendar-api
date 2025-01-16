const validateCandidateSlot=(requestedSlots)=>{
    for(let slot of requestedSlots){
        const start= new Date(slot.startTime);
        const end= new Date(slot.endTime)
        const isOneHour= (end.getHours() - start.getHours()) === 1;
        const isStartAligned = start.getMinutes() === 0 && start.getSeconds() === 0;
        const isEndAligned = end.getMinutes() === 0 && end.getSeconds() === 0;

        if (!isOneHour || !isStartAligned || !isEndAligned) {
            return false;
        }
    }
    return true;
}
module.exports={validateCandidateSlot}