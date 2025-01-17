const validateCandidateRequest=(body)=>{
    const { name, requestedSlots } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return {
      isValid: false,
      message: "Name is required and must be a non-empty string.",
    };
  }

  if (!Array.isArray(requestedSlots) || requestedSlots.length === 0) {
    return {
      isValid: false,
      message: "Requested slots must be a non-empty array.",
    };
  }

  for (const slot of requestedSlots) {
    const { day, startTime, endTime } = slot;

    if (
      !day ||
      typeof day !== "string" ||
      !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)
    ) {
      return {
        isValid: false,
        message: "Each requested slot must have a valid day (e.g., Monday, Tuesday).",
      };
    }

    if (!startTime || !endTime || isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
      return {
        isValid: false,
        message: "Each requested slot must have valid startTime and endTime format.",
      };
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return {
        isValid: false,
        message: "startTime must be before endTime for each requested slot.",
      };
    }
  }

  return {
    isValid: true,
    message: "Validation successful.",
  };

}

const validateInterviewerAvailability = (body) => {
    const { name, availability } = body;
  
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return {
        isValid: false,
        message: "Name is required and must be a non-empty string.",
      };
    }
  
    if (!Array.isArray(availability) || availability.length === 0) {
      return {
        isValid: false,
        message: "Availability must be a non-empty array.",
      };
    }
  
    for (const slot of availability) {
      const { day, startTime, endTime } = slot;
  
      if (
        !day ||
        typeof day !== "string" ||
        !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)
      ) {
        return {
          isValid: false,
          message: `Invalid day '${day}' in availability. It must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.`,
        };
      }
  
      if (!startTime || !endTime || isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
        return {
          isValid: false,
          message: `Invalid startTime or endTime in availability for day '${day}'. Both must be valid ISO date strings.`,
        };
      }
  
      if (new Date(startTime) >= new Date(endTime)) {
        return {
          isValid: false,
          message: `startTime must be before endTime for availability on '${day}'.`,
        };
      }
    }
  
    return {
      isValid: true,
      message: "Validation successful.",
    };
  };
  
module.exports={ validateCandidateRequest, validateInterviewerAvailability}