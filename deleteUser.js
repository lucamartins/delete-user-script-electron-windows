import { exec } from 'child_process';

exec('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList" /v ProfileImagePath /s', (err, stdout, _) => {
  if (err) {
    console.log('!!! Erro na execução do comando REG QUERRY para listar usuários:');
    console.error(err);
    return;
  }

  function extractInformation(stdout) {
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

  const usersInfo = extractInformation(stdout);
  // console.log(usersInfo);
});

exec('reg delete "HKLM\\..." /f', (err, stdout, stderr) => {
  if (err) console.log(err);

  console.log(stdout);
});
