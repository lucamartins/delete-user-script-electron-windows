import { exec } from 'child_process';

const extractInformation = (stdout) => {
  const splitted = stdout.split('\r\n').filter((val) => val);
  splitted.pop();

  const usersReg = [];
  const arrLength = splitted.length;

  // Agrupar aos pares SID e DIR
  for(let i = 0; i < arrLength; i++) {
    if (!(i % 2 === 0)) {
      usersReg.push({
        sid: splitted.shift(),
        dir: splitted.shift()
      });
    }
  }

  // Separar campos
  usersReg.forEach((user) => {
    user.sid = user.sid.split('\\');
    user.sid[0] = 'HKLM';
    user.dir = user.dir.split('    ');
  });

  usersReg.forEach((user) => {
    user.sid = user.sid.join('\\');
    user.dir = user.dir[user.dir.length - 1];
  });

  return usersReg;
}

export const getUsersInfo = () => {
  return new Promise((resolve, reject) => {
    exec('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList" /v ProfileImagePath /s', (err, stdout, _) => {
      if (err) reject(err);

      resolve(extractInformation(stdout));
    });
  });
}
