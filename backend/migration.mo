import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  public type AgentStatus = {
    #Active;
    #Inactive;
    #Banned;
    #Kicked;
    #Redacted;
  };

  type OldMostWanted = {
    id : Nat;
    name : Text;
    alias : Text;
    threatLevel : Text;
    lastKnownLocation : Text;
    charges : Text;
    status : Text;
  };

  type OldMission = {
    id : Nat;
    title : Text;
    department : Text;
    classificationLevel : Text;
    status : Text;
    description : Text;
    assignedAgents : [Nat];
    date : Text;
  };

  type OldAsset = {
    id : Nat;
    name : Text;
    assetType : Text;
    department : Text;
    status : Text;
    description : Text;
    clearanceLevel : Nat;
  };

  type OldAgent = {
    id : Nat;
    name : Text;
    codename : Text;
    department : Text;
    rank : Text;
    officerTitle : Text;
    status : AgentStatus;
    bio : Text;
    clearanceLevel : Nat;
  };

  // Old actor type.
  type OldActor = {
    nextAgentId : Nat;
    nextMissionId : Nat;
    nextAssetId : Nat;
    nextMostWantedId : Nat;
    agents : Map.Map<Nat, OldAgent>;
    missions : Map.Map<Nat, OldMission>;
    assets : Map.Map<Nat, OldAsset>;
    mostWanted : Map.Map<Nat, OldMostWanted>;
  };

  type NewMostWanted = {
    id : Nat;
    name : Text;
    alias : Text;
    threatLevel : Text;
    lastKnownLocation : Text;
    charges : Text;
    status : Text;
  };

  type NewMission = {
    id : Nat;
    title : Text;
    department : Text;
    classificationLevel : Text;
    status : Text;
    description : Text;
    assignedAgents : [Nat];
    date : Text;
  };

  type NewAsset = {
    id : Nat;
    name : Text;
    assetType : Text;
    department : Text;
    status : Text;
    description : Text;
    clearanceLevel : Nat;
  };

  type NewAgent = {
    id : Nat;
    name : Text;
    codename : Text;
    department : Text;
    rank : Text;
    officerTitle : Text;
    status : AgentStatus;
    bio : Text;
    clearanceLevel : Nat;
  };

  type Weapon = {
    id : Nat;
    name : Text;
    weaponType : Text;
    department : Text;
    status : Text;
    clearanceLevel : Nat;
    description : Text;
  };

  // New actor type.
  type NewActor = {
    nextAgentId : Nat;
    nextMissionId : Nat;
    nextAssetId : Nat;
    nextMostWantedId : Nat;
    nextWeaponId : Nat;
    agents : Map.Map<Nat, NewAgent>;
    missions : Map.Map<Nat, NewMission>;
    assets : Map.Map<Nat, NewAsset>;
    mostWanted : Map.Map<Nat, NewMostWanted>;
    weapons : Map.Map<Nat, Weapon>;
  };

  // Migration function called by actor's with-clause.
  public func run(old : OldActor) : NewActor {
    {
      old with
      nextWeaponId = 1;
      weapons = Map.empty<Nat, Weapon>();
    };
  };
};
