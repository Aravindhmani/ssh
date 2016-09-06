#!/bin/bash

   touch /root/trash 2> /dev/null
   if [  $? -ne  0  ]
   then 
      echo "error: Must execute as root user !!! "
      exit 1;
   fi
   export A_NEW_USER=$1
   export NEW_USER_PWD=$2
   
   # Create user and set password
   sudo -u postgres createuser ${A_NEW_USER}
   sudo -u postgres psql -c "ALTER USER ${A_NEW_USER} PASSWORD '${NEW_USER_PWD}';"

   echo " "
   echo Done creating new database user ${A_NEW_USER}

   # Create db for user 
   sudo -u postgres createdb ${A_NEW_USER}

   echo " "
   echo Done creating new user database ${A_NEW_USER}
   echo   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

exit 0
