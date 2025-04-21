// till now Secretary users will be manage manually by the system admin
// so secretary will be hard coded in the system


import { Secretary } from '../types';
export interface SecretaryDao {

  getSecretaryById(id: string): Secretary | undefined;
  getSecretaryByEspecialId(id: string): Secretary | undefined;
  getSecretaryByEmail(email: string): Secretary | undefined;

}