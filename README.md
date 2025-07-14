# public-records-portal

<h2>Basic work flow:</h2>
<ol>
  <li>Obtain a users records request</li>
  <li>Send the request to the server</li>
  <li>
    <ul>
      <li>show the user a confirmation number and notice</li>
      <li>email user a confirmation email</li>
      <li>add request to agency queue</li>
      <li>notify agency of new request</li>
    </ul>
    <li>agency internally process request</li>
    <li>agency uploads response to the application</li>
  <li>agency finalizes request</li>
  <li>user gets notification if completed request and sent an email copy</li>
  </li>
</ol>
<hr>

### How user editable forms are stored

User editable forms in the database are stored in the *client_forms* table as with the form design being stored as a JSON object. Each form will be assigned a UID that is generated using the current date/time in the format of year as represented by two digits, days into the year, plus the servers system time in seconds into the day, and the agency id (primary key from the client table). ie. A form submitted on
*client_form* schema

| name | type | description |
| --- | --- | --- |
| id | int | table primary id |
| client_id | int | foreign key link to the *clients* table |
| uid | int | a unique id for the form used for user abstraction |
| embed | bool | is this form embeddable 
| enabled | bool | is the client accepting information submitted from this form |
| portal_enrolled | bool | can signed in user accessed this form |
| portal_unenrolled | bool | can anyone access this form |
embed_access | bool | can this form be accessed via an embed |
| form_design | object | form design parameters |
| embed_html | text | pre made embed HTML |


#### Design of user forms are stored

User designed forms have three parts associated with them a basic info, public fields, admin fields.

The public and admin sides are stored as objects while basic information is stored as key value.

Basic information contains the forms 
name```, agency ```logo``` location, and ```work-flow``` id.

User designed input fields have the following attributes.

```
{
    "formId": "string",                // Unique identifier for the form
    "formName": "string",              // Name of the form
    "description": "string",           // Optional description
    "createdBy": "string",             // User who created the form
    "createdAt": "2024-06-10T12:00:00Z", // Creation timestamp
    "editLog": [
        {
            "editedBy": "int",             //User who eddited the form
            "editedAt": "345678",          //Timestamp
            "comments": "string",           //Usercoments
            "changeSummar": [{
                "fieldId": "string",    //Id of field changed
                "old": {}, //old key value
                "new": {} //new key value            
        }]
        }
    ],
    "public-fields": [                  // Fields that the public have access to
        {
            "fieldId": "string",           // Unique identifier for the field
            "aliasId":  "string",           // Unique fieldIdAlias for user readable and api use
            "label": "string",             // Field label
            "type": "text",                // Field type (e.g., text, number, select, checkbox, date)
            "required": true,              // Is the field required?
            "options": [                   // For select, radio, checkbox types
                {
                    "value": "string",
                    "displayText": "string"
                }
            ],
            "defaultValue": "string",      // Default value for the field
            "placeholder": "string",       // Placeholder text
            "order": 1                     // Order of the field in the form
        }
        // ... more fields
    ],
     "admin-fields": [                  // Fields that the public have access to
        {
            "fieldId": "string",           // Unique identifier for the field
            "label": "string",             // Field label
            "type": "text",                // Field type (e.g., text, number, select, checkbox, date)
            "required": true,              // Is the field required?
            "options": [                   // For select, radio, checkbox types
                {
                    "value": "string",
                    "displayText": "string"
                }
            ],
            "defaultValue": "string",      // Default value for the field
            "placeholder": "string",       // Placeholder text
            "order": 1                     // Order of the field in the form
        }
        // ... more fields
    ],
    "settings": {
        "theme": "light",                // Optional: form theme
        "submitButtonText": "Submit",     // Optional: submit button text
        "workFlow": "int",            //what workflow-id gets this
        "groupOwner": "int"             //What group owns this
    }
}
```