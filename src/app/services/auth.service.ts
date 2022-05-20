import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {
  }

  initAuthListener(): void {
    this.auth.authState.subscribe(fu => {
      console.log(fu);
      console.log(fu?.uid);
      console.log(fu?.email);
    });
  }

  crearUsuario(registroForm: any): Promise<void> {
    const {nombre, correo, password} = registroForm;

    return this.auth.createUserWithEmailAndPassword(correo, password)
      .then(({user}) => {
        const newUser = new Usuario(user.uid, nombre, correo);
        return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
      });
  }

  autenticarUsuario(loginForm: any): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']> {
    const {correo, password} = loginForm;

    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logout(): ReturnType<firebase.auth.Auth['signOut']> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(fu => fu != null)
    );
  }

}
