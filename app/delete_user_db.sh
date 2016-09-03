#!/bin/bash

   touch /root/trash 2> /dev/null
   if [  $? -ne  0  ]
   then 
      echo "error: Must execute as root user !!! "
      exit 0;
   fi
   export A_NEW_USER=$1
   
   # Drop db user
   sudo -u postgres dropuser ${A_NEW_USER}

   echo " "
   echo Done dropping database user ${A_NEW_USER}

   # Drop user db 
   sudo -u postgres dropdb ${A_NEW_USER}

   echo " "
   echo Done deleting user database ${A_NEW_USER}
   echo   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

exit 0
