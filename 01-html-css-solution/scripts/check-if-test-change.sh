for studentFolder in */;
do
  cd $studentFolder;
  nbWordChangeCypress=($(git diff ./cypress | wc -w))
  nbWordChangeCI=($(git diff ./.github | wc -w))
  echo $studentFolder
  if [[ $nbWordChangeCI -gt 0 || $nbWordChangeCypress -gt 0 ]]
  then
    tput setaf 1; echo nbWordChangeCypress $nbWordChangeCypress
    tput setaf 1; echo nbWordChangeCI $nbWordChangeCI
  else
    tput setaf 2; echo GOOD
  fi
  cd ..
done