
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
            password: "<Hashed String>",
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
                                        vaultPath: "<URL String>",
                                        email: "<Email Id String>",
                                        vaultKey: "<String>"
                                        
                                        // service specific details
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

                                        // service specific details
                                    }
                                ]
                            }
                        ]
                    }
                ],
                aws: [
                    {
                        id: "<mongo id object>",
                        verboseName: "AWS",
                        type: "aws",
                        vaultURL: "IP Add of the vault",
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
                ssh: [
                    {
                        id: "<mongo id object>",
                        verboseName: "SSH",
                        type: "<String>",
                        vaultURL: "<URL String>",
                        mountPoint: "<String/URL>",

                        CA_Configurations: {
                            ca_config_url: "<String/URL>",
                            ca_public_key_url: "<String/URL>"
                        },

                        roles: [
                            {
                                id: "<mongo id object>",
                                verboseName: "<String>",
                                path: "",

                                max_ttl: "time in seconds",

                                remote_machine_ip: "IP Address",
                                remote_machine_username: "<String>",

                                generated_keys: [
                                    {
                                        id: "<mongo id object>",
                                        status: "Bool (valid/invalid)",
                                        generated_on: "Date-Time Object",
                                        expires_on: "Date-Time Object",
                                        key_name: "<String>",
                                        public_key: "<String>",
                                        private_key: "<String>",
                                        key_certificate: "<String>"

                                    }
                                ]
                            }
                        ]
                    }
                ],
                gcp: [],
                gpg: [],
            }
        }
    ]
};
