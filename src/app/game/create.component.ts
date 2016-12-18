import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, CivDef, Civ6Leaders, CreateGameRequestBody } from 'pydt-shared';
import { ConfigureGameModel } from './config.component';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'pydt-create-game',
  templateUrl: './create.component.html'
})
export class CreateGameComponent implements OnInit {
  private model = new CreateGameModel();
  private busy: Promise<any>;

  // tslint:disable-next-line:no-unused-variable - template variable
  private allLeaders = Civ6Leaders;

  @ViewChild('cannotCreateGameModal') cannotCreateGameModal: ModalDirective;
  @ViewChild('mustSetEmailModal') mustSetEmailModal: ModalDirective;

  constructor(private api: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.api.getSteamProfile().then(profile => {
      this.model.displayName = profile.personaname + '\'s game!';
    });

    this.busy = this.api.getUserGames()
      .then(resp => {
        return this.api.getSteamProfile().then(profile => {
          for (let game of resp.data) {
            if (game.createdBySteamId === profile.steamid) {
              this.cannotCreateGameModal.show();
              return;
            }
          }

          return this.api.getUser();
        });
      })
      .then(user => {
        if (user) {
          if (!user.emailAddress) {
            this.mustSetEmailModal.show();
          }
        }
      });
  }

  selectedCivChange(civ: CivDef) {
    this.model.player1Civ = civ;
  }

  onSubmit() {
    this.busy = this.api.createGame(this.model.toJSON())
      .then(game => {
        this.router.navigate(['/game', game.gameId]);
      });
  }
}

class CreateGameModel extends ConfigureGameModel {
  public player1Civ = Civ6Leaders[0];

  toJSON(): CreateGameRequestBody {
    const result: any = super.toJSON();
    result.player1Civ = this.player1Civ.leaderKey;
    return result;
  }
}
