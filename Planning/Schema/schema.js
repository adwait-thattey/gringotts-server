
schema =  {
    users : [
        {   
            // Basic user details
            id: "<mongo id object>",
            name: "<String>",
            email: "<String>",
            phone_number: "<String>",
            is_superuser : "<bool>",
            vault_role: "<vault role object>",
            password: "<String>",
            profilePicture: "<String>",
            
            // engines

            engines : {
                kv: [
                    {   
                        id: "<mongo id object>",
                        verboseName: "Credentials",
                        type: "<String>",
                        vaultURL: "<URL String>",
                        mountPoint: "<String/URL>",
                        
                        // other engine details

                        categories: [
                            {
                                // For email
                                id: "<mongo id object>",
                                name: "<String>",
                                verboseName: "<String>",
                                image: "<URL String",
                                vaultPath: "<Partial URL String>",

                                creds: [
                                    {
                                        id: "<mongo id object>",
                                        serviceId: "<Link to specific details>",
                                        vaultPath: "<URL String",
                                        email: "<Email Id String>",
                                        vaultKey: "<String>"

                                        // service specic details
                                    }
                                ]
                            },
                            {
                                // For social media
                                id: "<mongo id object>",
                                name: "<String>",
                                verboseName: "<String>",
                                image: "<URL String",
                                vaultPath: "<Partial URL String>",

                                creds: [
                                    {
                                        id: "<mongo id object>",
                                        serviceId: "<Link to specific details>",
                                        vaultPath: "<URL String",
                                        email: "<Email Id String>",
                                        phoneNumber: "<Phone number>",
                                        vaultKey: "<String>"

                                        // service specic details
                                    }
                                ]
                            }
                        ]
                    }
                ],
                aws: [
                    {
                        id: "<mongo id object>",
                        verboseName: "Credentials",
                        type: "<String>",
                        vaultURL: "<URL String>",
                        mountPoint: "<String/URL>",

                        accountName: "",

                        roles : [
                            {
                                id: "<mongo id object>",
                                verboseName: "<String>",
                                path: "",
                                
                                generatedCredentials : [
                                    {
                                        // actual credentuials are not stored. Only path is stored
                                        id: "<mongo id object>",
                                        status: "<Boolean>",
                                        credPath: "<String>",
                                        generatedOn: "<Date Time Object>",
                                        expiresOn: "<Date Time Object>"
                                    }
                                ]
                            }
                        ]
                        
                    }
                ],
                gcp: [],
                gpg: [],
                ssh: []
                
            }
        }
    ]
};
