# ISP-FSB Status

Application to check your ISP FSB FOID/CCL status and receive an email after status has changed.

<br/>

# Requirements

- Gmail Account
- Node - https://nodejs.org/en/download/

<br/>

# How to Install

_npm i_

<br/>

# How to Run

_node index.js [arguments]_

Arguments as follow:

--gmailUsername=your_gmail_account **\*REQUIRED**

--gmailPassword=your_gmail_password **\*REQUIRED**

--toEmail=email_address_for_notification **\*REQUIRED**

--ispUsername=your_isp_username **\*REQUIRED**

--ispPassword="your_isp_password" **\*REQUIRED**

--ispLastName=your_last_name **\*REQUIRED**

--ispDOB=10/10/1971 **\*REQUIRED**

--ccl **\*Only needed if checking on CCL status instead of FOID**

--submitted **\*Use if you're currently in SUBMITTED status**

--qc_verified **\*Use if you're currently in QC_VERIFIED status**

<br/>

# Example

**_### FOID currently in SUBMITTED status_**

node index.js --gmailUsername=example@gmail.com --gmailPassword=fakepassword --toEmail=example@gmail.com --ispUsername=exampleusername --ispPassword="fakeisppassword" --ispLastName=Smith --ispDOB=07/10/1970 --submitted

**_### CCL currently in QC_VERIFIED status_**

node index.js --gmailUsername=example@gmail.com --gmailPassword=fakepassword --toEmail=example@gmail.com --ispUsername=exampleusername --ispPassword="fakeisppassword" --ispLastName=Smith --ispDOB=07/10/1970 --ccl --qc_verified
