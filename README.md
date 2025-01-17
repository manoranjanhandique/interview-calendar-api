## **interview-calendar-api**

##### Overview

This system allows:

- Candidates to request interview slots.
- Interviewers to manage their availability and booked slots.
- Admins to assign interviewers to candidates’ requested slots.

**Prerequisites**

Before setting up the project, make sure the following tools are installed on your system:

- Node.js
- MongoDB Compass
- GIT
- VS Code
- Postman

## Installation Steps

1. **Create a New DB Connection**:

   - Open MongoDB Compass.
   - Click on **"New Connection"**.
   - For local installations, enter the following as the Connection String:

   ```
   mongodb://localhost:27017
   ```

2. **Test the Connection**:

   - Click on **"Connect"** to test the connection.
   - If successful, you will see a list of databases.

3. **Navigate to the Database**:

   - Create a new database (if not present) named `interview_calendar`.

4. **Clone the Repository**

   ```
   git clone "https://github.com/manoranjanhandique/interview-calendar-api.git"
   cd interview-calendar-api
   ```

5. **Install Dependencies**

   ```
   npm install
   ```

6. **Set Up Environment Variables** Create a `.env` file and add the following:

   ```
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/interview_calendar
   ```

7. **Start the Server**

   ```
   npm start
   ```

   The server will run at `http://localhost:8000`.

## API Endpoints Documentation

### **Install Postman**:

- Download and install Postman from postman.com.

- Create a new collection in Postman to group related API endpoints.
- Add the following API endpoints:

> *Please follow the given request body structure only for testing.*

### 1. **Candidate APIs**

#### **1.1 Request Slot**

**POST** `/api/candidates/requested-slot`

Request Body:

```
{
    "name": "Ques",
    "requestedSlots": [
        { 
            "day": "Monday", 
            "startTime": "2025-01-20T10:00:00", 
            "endTime": "2025-01-20T1:00:00" 
        }
    ]
}
```

Response:

```
{
    "success": true,
    "message": "Requested slots saved successfully.",
    "candidate": {
        "name": "Ques",
        "requestedSlots": [
            {
                "day": "Monday",
                "startTime": "2025-01-20T04:30:00.000Z",
                "endTime": "2025-01-20T05:30:00.000Z",
                "isAssigned": false,
                "_id": "678aa786b5d7b608760cb928"
            }
        ],
        "_id": "678aa786b5d7b608760cb927",
        "bookedSlot": [],
        "createdAt": "2025-01-17T18:55:02.053Z",
        "updatedAt": "2025-01-17T18:55:02.053Z",
        "__v": 0
    }
}
```

#### **1.2 View Pending Slots**

> This endpoint allows you to fetch all candidates with pending slots, where 'pending' means the candidate has requested a slot, but no interviewer has been assigned to it yet. A slot is considered 'pending' until it has an assigned interviewer.

**GET** `/api/candidate/pending-slots/:id?`

Optional `id`: Candidate ID (to fetch pending slots for a specific candidate).

Response:

```
{
    "success": true,
    "data": [
        {
            "candidate": "Curl",
            "pendingSlots": [
                {
                    "day": "Tuesday",
                    "startTime": "12:00 PM",
                    "endTime": "1:00 PM",
                    "availableInterviewer": ["Ines"]
                }
            ]
        },
        {
            "candidate": "John",
            "pendingSlots": [
                {
                    "day": "Monday",
                    "startTime": "10:00 AM",
                    "endTime": "11:00 AM",
                    "availableInterviewer": []
                }
            ]
        }
    ]
}
```

#### **1.3 View Requested Slots**

This end point allows you to fetch all candidates requested slot with booked slot.

**GET** `/api/candidates/available-requests`

Sample Response:

    {
        "success": true,
        "message": "List of candidates with requested slots retrieved 	      successfully.",
        "candidates": [
            {
                "_id": "6789625aa223888985dfc2b4",
                "name": "Raj",
                "requestedSlots": [
                    {
                        "day": "Tuesday",
                        "startTime": "2025-01-20T06:30:00.000Z",
                        "endTime": "2025-01-20T07:30:00.000Z",
                        "isAssigned": true,
                        "_id": "6789625aa223888985dfc2b5"
                    }
                ],
                "bookedSlot": [
                    {
                        "interviewer": "67896249a223888985dfc2a4",
                        "day": "Tuesday",
                        "startTime": "2025-01-20T06:30:00.000Z",
                        "endTime": "2025-01-20T07:30:00.000Z",
                        "_id": "678962aba223888985dfc2d9"
                    }
                ],
                "createdAt": "2025-01-16T19:47:38.941Z",
                "updatedAt": "2025-01-16T19:48:59.167Z",
                "__v": 1
            }
        ]
    }


### 2. **Interviewer APIs**

#### **2.1 Set Interviewer's Availability

> This endpoint allows interviewers sets their availability slots.

**POST** `/api/interviewers`

Optional `id`: Interviewer ID (to fetch availability for a specific interviewer).

Sample Request Body:

```
{
  "name": "Ines",
  "availability": [
    { "day": "Monday", "startTime": "2025-01-20T09:00:00", "endTime": "2025-01-20T16:00:00" },
    { "day": "Tuesday", "startTime": "2025-01-21T09:00:00", "endTime": "2025-01-21T16:00:00" },
    { "day": "Wednesday", "startTime": "2025-01-22T09:00:00", "endTime": "2025-01-22T16:00:00" },
    { "day": "Thursday", "startTime": "2025-01-23T09:00:00", "endTime": "2025-01-23T16:00:00" },
    { "day": "Friday", "startTime": "2025-01-24T09:00:00", "endTime": "2025-01-24T16:00:00" },
    { "day": "Saturday", "startTime": "2025-01-25T09:00:00", "endTime": "2025-01-25T16:00:00" },
    { "day": "Sunday", "startTime": "2025-01-26T09:00:00", "endTime": "2025-01-26T16:00:00" }
  ]
}
```

Sample Response Body

```
{
    "message": "Interviewer added successfully",
    "interviewer": {
        "name": "Raj",
        "availability": [
            {
                "day": "Monday",
                "startTime": "2025-01-20T03:30:00.000Z",
                "endTime": "2025-01-20T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4cfe"
            },
            {
                "day": "Tuesday",
                "startTime": "2025-01-21T03:30:00.000Z",
                "endTime": "2025-01-21T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4cff"
            },
            {
                "day": "Wednesday",
                "startTime": "2025-01-22T03:30:00.000Z",
                "endTime": "2025-01-22T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4d00"
            },
            {
                "day": "Thursday",
                "startTime": "2025-01-23T03:30:00.000Z",
                "endTime": "2025-01-23T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4d01"
            },
            {
                "day": "Friday",
                "startTime": "2025-01-24T03:30:00.000Z",
                "endTime": "2025-01-24T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4d02"
            },
            {
                "day": "Saturday",
                "startTime": "2025-01-25T03:30:00.000Z",
                "endTime": "2025-01-25T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4d03"
            },
            {
                "day": "Sunday",
                "startTime": "2025-01-26T03:30:00.000Z",
                "endTime": "2025-01-26T10:30:00.000Z",
                "_id": "678aaf7d10d0f5c2423a4d04"
            }
        ],
        "_id": "678aaf7d10d0f5c2423a4cfd",
        "bookedSlots": [],
        "createdAt": "2025-01-17T19:29:01.841Z",
        "updatedAt": "2025-01-17T19:29:01.841Z",
        "__v": 0
    }
}
```

#### **2.2 Assign Interviewer to Candidate's Requested Slot**

> This endpoint allows you to assign interviewer to candidate's requested slot.

**POST** `api/assign-interviewer`

Request Body:

```
{
  "candidateId": "678946500cdb06302a5b5a1d",
  "interviewerId": "786056500adb06302a5b3f1c"
}
```

Response:

```
{
  "success": true,
  "message": "Interviewer assigned to the candidate successfully.",
  "data": {
    "candidate": "Raj",
    "interviewer": "Ingrid",
    "bookedSlot": {
      "day": "Monday",
      "startTime": "10:00 AM",
      "endTime": "11:00 AM"
    }
  }
}
```

#### **2.3 Get the information of Interviewer **

> This endpoint allows you to get the interviewer's free slots and book slots. It will help to know the availability of interviewers.

**GET** `http://localhost:8000/api/interviewers/availability/:id?`

Response:

```
{
    "success": true,
    "data": [
        {
            "interviewer": "Ines",
            "slot": [
                {
                    "day": "Monday",
                    "freeSlots": [
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM"
                    ]
                },
                {
                    "day": "Tuesday",
                    "freeSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM",
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": [
                        "12:00 PM - 1:00 PM"
                    ]
                },
                {
                    "day": "Wednesday",
                    "freeSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM",
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": [
                        "1:00 PM - 2:00 PM"
                    ]
                },
                {
                    "day": "Thursday",
                    "freeSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM",
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": []
                },
                {
                    "day": "Friday",
                    "freeSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM",
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": []
                },
                {
                    "day": "Saturday",
                    "freeSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM",
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": []
                },
                {
                    "day": "Sunday",
                    "freeSlots": [
                        "9:00 AM - 10:00 AM",
                        "10:00 AM - 11:00 AM",
                        "11:00 AM - 12:00 PM",
                        "12:00 PM - 1:00 PM",
                        "1:00 PM - 2:00 PM",
                        "2:00 PM - 3:00 PM",
                        "3:00 PM - 4:00 PM"
                    ],
                    "bookedSlots": []
                }
            ]
        }
    ]
}
```

**2.4 Get the information of Interviewer's Booked Slots **

> This endpoint allows you to get information of the interviewer's booked slot with which candidates and what time. 

**GET** `http://localhost:8000/api/interview/booked-slots/:id?`

Optional `id`: Interviewer ID (to fetch pending slots for a specific Interviewer).

Sample Response

```
{
    "success": true,
    "data": [
        {
            "interviewer": "Ines",
            "bookedSlots": [
                {
                    "candidate": "Raj",
                    "day": "Tuesday",
                    "startTime": "12:00 PM",
                    "endTime": "1:00 PM"
                },
                {
                    "candidate": "Max",
                    "day": "Monday",
                    "startTime": "9:00 AM",
                    "endTime": "10:00 AM"
                },
                {
                    "candidate": "Min",
                    "day": "Monday",
                    "startTime": "10:00 AM",
                    "endTime": "11:00 AM"
                }
            ]
        },
    ]
}
```

### Future Enhancements:

1. **Authorization and Authentication:**
2. **Unit Test Coverage**
3. **Event Notifications**
4. **Flexible JSON structure** 
5. **and many more...**

