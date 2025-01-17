const validateCandidateRequest=(body)=>{
    const { name, requestedSlots } = body;

  // Validate `name`
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return {
      isValid: false,
      message: "Name is required and must be a non-empty string.",
    };
  }

  // Validate `requestedSlots`
  if (!Array.isArray(requestedSlots) || requestedSlots.length === 0) {
    return {
      isValid: false,
      message: "Requested slots must be a non-empty array.",
    };
  }

  // Validate each slot in `requestedSlots`
  for (const slot of requestedSlots) {
    const { day, startTime, endTime } = slot;

    // Validate `day`
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

    // Validate `startTime` and `endTime`
    if (!startTime || !endTime || isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
      return {
        isValid: false,
        message: "Each requested slot must have valid startTime and endTime format.",
      };
    }

    // Ensure `startTime` is before `endTime`
    if (new Date(startTime) >= new Date(endTime)) {
      return {
        isValid: false,
        message: "startTime must be before endTime for each requested slot.",
      };
    }
  }

  // If all validations pass
  return {
    isValid: true,
    message: "Validation successful.",
  };

}

const validateInterviewerAvailability = (body) => {
    const { name, availability } = body;
  
    // Validate `name`
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return {
        isValid: false,
        message: "Name is required and must be a non-empty string.",
      };
    }
  
    // Validate `availability`
    if (!Array.isArray(availability) || availability.length === 0) {
      return {
        isValid: false,
        message: "Availability must be a non-empty array.",
      };
    }
  
    // Validate each availability slot
    for (const slot of availability) {
      const { day, startTime, endTime } = slot;
  
      // Validate `day`
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
  
      // Validate `startTime` and `endTime`
      if (!startTime || !endTime || isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
        return {
          isValid: false,
          message: `Invalid startTime or endTime in availability for day '${day}'. Both must be valid ISO date strings.`,
        };
      }
  
      // Ensure `startTime` is before `endTime`
      if (new Date(startTime) >= new Date(endTime)) {
        return {
          isValid: false,
          message: `startTime must be before endTime for availability on '${day}'.`,
        };
      }
    }
  
    // If all validations pass
    return {
      isValid: true,
      message: "Validation successful.",
    };
  };
  
module.exports={ validateCandidateRequest, validateInterviewerAvailability}