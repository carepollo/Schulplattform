import { Component, OnInit, Input } from '@angular/core';
import { User } from "src/app/models/User";
import { Person } from "src/app/models/Person";
import { SelectOption } from "src/app/models/SelectOption";
import { PanelService } from "src/app/services/panel.service";

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  @Input() userdata: User

  visible:boolean = true
  disableCityExpedition:boolean = true
  disableCityLives:boolean = true
  optionsZone:Array<SelectOption>
  optionsCity:Array<SelectOption>

  constructor(private panelService:PanelService) {
    this.userdata = {
      person: {
        zone_expedition:{value:0},
        zone_lives: {value: 0},
        city_expedition: {value: 0},
        city_lives: {value: 0}
      }
    }
    this.optionsZone = []
    this.optionsCity = []
  }

  ngOnInit(): void {
    this.panelService.getOptionList('departamentos', 0).subscribe(
      response => {this.optionsZone = response},
      error => {console.warn(error)}
    )
  }

  updateProfileData(profileData:User): void{
    this.panelService.updateUserData(profileData).subscribe(
      resp => {},
      error => {console.warn(error)}
    )
    this.panelService.updatePersonData(profileData).subscribe(
      resp => {},
      error => {console.warn(error)}
    )
  }

  unlockSelector(selector:string):void {
    switch (selector) {
      case 'zone_expedition':
        this.disableCityExpedition = false
        this.getSelectorData('municipios', this.userdata.person.zone_expedition.value)
        break;
      case 'zone_lives':
        this.disableCityLives = false
        this.getSelectorData('municipios', this.userdata.person.zone_lives.value)
        break;
    }
  }

  getSelectorData(select:string, option:number):void {
    this.panelService.getOptionList(select, option).subscribe(
      resp => {
        this.optionsCity = resp
      },
      err => {console.log(err)})
  }
}