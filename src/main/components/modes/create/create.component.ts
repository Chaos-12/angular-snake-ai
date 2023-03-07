import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputType, Robot, RobotOld, Subject, Tolerances, TolerancesOld } from "src/main/data";
import { RobotLogic, RobotOldLogic } from 'src/main/services';
import { PubSubService, Subscriber } from 'src/main/services';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy, Subscriber {

  public robotOldList:Array<RobotOld> = [];
  public robotList:Array<Robot> = [];
  public tolList:Array<TolerancesOld> = [];

  public tolerances:TolerancesOld = new TolerancesOld(0, 0, 0, 0);
  public tolerance = new Tolerances();

  constructor(
    private pubSub:PubSubService,
    private robotOldLogic:RobotOldLogic,
    private robotLogic:RobotLogic) { }

  ngOnInit(): void {
    this.pubSub.subscribe(this, Subject.deleteSnake);
    this.createOldIa(new TolerancesOld(100, -100, -100, -100));
    //this.createOldIa(new TolerancesOld(100, -80, -80, 0));
    //this.createOldIa(new TolerancesOld(100, -80, -80, 20));
    //this.createOldIa(new TolerancesOld(100, -80, -80, 60));
    //this.createOldIa(new TolerancesOld(100, -80, -20, -80));
    //this.createOldIa(new TolerancesOld(100, -80, -80, -20));

    this.tolerance.setValue(InputType.food, 1);
    this.tolerance.setValue(InputType.body, -0.5);
    this.tolerance.setValue(InputType.wall, -0.5);
    this.tolerance.setValue(InputType.rock, -0.5);
    let newRobot = this.robotLogic.buildRobot(this.tolerance);
    this.robotList.push(newRobot);
  }

  ngOnDestroy(): void {
    this.robotOldList = [];
  }

  notify(message:string):void{
    this.deleteRobot(message);
  }

  public createOldIa(tolerances:TolerancesOld):void{
    let newRobot = this.robotOldLogic.buildRobotOld(tolerances);
    this.robotOldList.push(newRobot);
    this.tolList.push(tolerances);
  }

  private deleteRobot(idRobot:string): void{
    for (let i = 0; i<this.robotOldList.length; i++){
      if (this.robotOldList[i].id == idRobot){
        this.robotOldList.splice(i, 1);
        this.tolList.splice(i, 1);
        return;
      }
    }
  }
}
