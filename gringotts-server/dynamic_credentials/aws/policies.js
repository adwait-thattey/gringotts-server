exports.EC2FullAccess = {
        "Version": "2012-10-17",
        "Statement": {
            "Effect": "Allow",
            "Action": "ec2:*",
            "Resource": "*"
        }
    };



// JSON.stringify(policies.EC2FullAccess)
