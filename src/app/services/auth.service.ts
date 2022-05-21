import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Usuario} from '../models/usuario.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubscription: Subscription = null;

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>,
  ) {
  }

  initAuthListener(): void {
    this.auth.authState.subscribe(fu => {
      if (fu) {
        this.userSubscription = this.firestore.doc(`${fu.uid}/usuario`).valueChanges().subscribe(fuser => {
          // @ts-ignore
          const user = Usuario.fromFirebase(fuser);
          this.store.dispatch(authActions.setUser({user}));
        });
      } else {
        if (this.userSubscription !== null) {
          this.userSubscription.unsubscribe();
          this.store.dispatch(authActions.unSetUser());
        }
      }

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
