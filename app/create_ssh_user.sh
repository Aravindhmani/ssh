#!/bin/bash
#
# #############################################################################
# Create new SSH user (Ubuntu)
# I use this script whenever I need to add a new SSH user to an Ubuntu machine.
# Usage:
# 1)  Download the file 
# 2)  Make it executable with -  chmod a+x createNewSSHUser.sh  
# 3)  Execute it with : sudo ./createNewSSHUser.sh
# 4)  Immediately set a new password by logging in once with -
#          su newUsrName
# #############################################################################
#
   #
   touch /root/trash 2> /dev/null
   if [  $? -ne  0  ]
   then 
      echo "error: Must execute as root user !!! "
      exit 1;
   fi
   export A_NEW_USER=$1
   export NEW_USER_PWD=$2
   #
   echo New User is $A_NEW_USER identified by $NEW_USER_PWD
   #
   #echo "Get ${A_NEW_USER} home directory .. . . . . . . . "
   #export A_NEW_USER_HOME=$( grep "${A_NEW_USER}" /etc/passwd | awk -F: '{print $6}' )
   #echo "New user's home directory is ${A_NEW_USER_HOME}"
   #
   if [ `id -u $A_NEW_USER 2>/dev/null || echo -1` -ge 0 ]; then
   echo "The ${A_NEW_USER} user account is already configured in ${A_NEW_USER_HOME} . . . "
   exit 1
   
   else

   export PASS_HASH=$(perl -e 'print crypt($ARGV[0], "password")' "$NEW_USER_PWD")
   #echo ${PASS_HASH}
   
   # addgroup imad-dev
   useradd -Ds /bin/bash
   #useradd -m -G imad-dev -p ${PASS_HASH} ${A_NEW_USER}
   useradd -m -s /bin/bash -G imad-dev -p ${PASS_HASH} ${A_NEW_USER}
   #passwd -e ${A_NEW_USER}
   #
   A_NEW_USER_HOME=/home/${A_NEW_USER}
  
   
   fi
   #
   echo "................................................................"
   echo "Prepare for SSH tasks"
   echo "................................................................"

   export A_NEW_USER_SSH_DIR=${A_NEW_USER_HOME}/.ssh
   mkdir -p ${A_NEW_USER_SSH_DIR}
   chmod 700 ${A_NEW_USER_SSH_DIR}
   #
   pushd ${A_NEW_USER_SSH_DIR}
   #
     #
     echo "................................................................"
     echo "Generate SSH key pair for ${A_NEW_USER}"
     echo "................................................................"
     rm -f id_rsa*
     ssh-keygen -f id_rsa -t rsa -N '' -C "${A_NEW_USER}@${A_NEW_USER}.me"
     #
   #
   popd
   #
   echo "................................................................"
   echo "Assign correct ownership ......................................"
   echo "................................................................"
   #chown -R ${A_NEW_USER}:imad-dev /home/${A_NEW_USER}
   chmod 700 /home/${A_NEW_USER}
   #
   echo "................................................................"
   echo "Here is ${A_NEW_USER}'s public key"
   echo "................................................................"
   echo " "
   cat ${A_NEW_USER_SSH_DIR}/id_rsa.pub
   echo " "
   echo " "
   echo " "
   echo Done creating new user ${A_NEW_USER}
   echo   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

exit 0
