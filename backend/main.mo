import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type AgentStatus = {
    #Active;
    #Inactive;
    #Banned;
    #Kicked;
    #Redacted;
  };

  type Agent = {
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

  module Agent {
    public func compare(agent1 : Agent, agent2 : Agent) : Order.Order {
      Text.compare(agent1.codename, agent2.codename);
    };
  };

  type Mission = {
    id : Nat;
    title : Text;
    department : Text;
    classificationLevel : Text;
    status : Text;
    description : Text;
    assignedAgents : [Nat];
    date : Text;
  };

  module Mission {
    public func compare(mission1 : Mission, mission2 : Mission) : Order.Order {
      Text.compare(mission1.title, mission2.title);
    };
  };

  type Asset = {
    id : Nat;
    name : Text;
    assetType : Text;
    department : Text;
    status : Text;
    description : Text;
    clearanceLevel : Nat;
  };

  module Asset {
    public func compare(asset1 : Asset, asset2 : Asset) : Order.Order {
      Text.compare(asset1.name, asset2.name);
    };
  };

  type MostWanted = {
    id : Nat;
    name : Text;
    alias : Text;
    threatLevel : Text;
    lastKnownLocation : Text;
    charges : Text;
    status : Text;
  };

  module MostWanted {
    public func compare(mw1 : MostWanted, mw2 : MostWanted) : Order.Order {
      Text.compare(mw1.name, mw2.name);
    };
  };

  var nextAgentId = 1;
  var nextMissionId = 1;
  var nextAssetId = 1;
  var nextMostWantedId = 1;

  let agents = Map.empty<Nat, Agent>();
  let missions = Map.empty<Nat, Mission>();
  let assets = Map.empty<Nat, Asset>();
  let mostWanted = Map.empty<Nat, MostWanted>();

  // Agents CRUD
  public shared ({ caller }) func createAgent(
    name : Text,
    codename : Text,
    department : Text,
    rank : Text,
    officerTitle : Text,
    status : AgentStatus,
    bio : Text,
    clearanceLevel : Nat,
  ) : async Nat {
    let id = nextAgentId;
    nextAgentId += 1;

    let agent : Agent = {
      id;
      name;
      codename;
      department;
      rank;
      officerTitle;
      status;
      bio;
      clearanceLevel;
    };

    agents.add(id, agent);
    id;
  };

  public shared ({ caller }) func updateAgent(
    id : Nat,
    name : Text,
    codename : Text,
    department : Text,
    rank : Text,
    officerTitle : Text,
    status : AgentStatus,
    bio : Text,
    clearanceLevel : Nat,
  ) : async () {
    switch (agents.get(id)) {
      case (null) { Runtime.trap("Agent not found") };
      case (?_) {
        let updatedAgent : Agent = {
          id;
          name;
          codename;
          department;
          rank;
          officerTitle;
          status;
          bio;
          clearanceLevel;
        };
        agents.add(id, updatedAgent);
      };
    };
  };

  public shared ({ caller }) func banAgent(id : Nat) : async () {
    switch (agents.get(id)) {
      case (null) { Runtime.trap("Agent not found") };
      case (?agent) {
        let updatedAgent : Agent = {
          id = agent.id;
          name = agent.name;
          codename = agent.codename;
          department = agent.department;
          rank = agent.rank;
          officerTitle = agent.officerTitle;
          status = #Banned;
          bio = agent.bio;
          clearanceLevel = agent.clearanceLevel;
        };
        agents.add(id, updatedAgent);
      };
    };
  };

  public shared ({ caller }) func removeAgent(id : Nat) : async () {
    if (not agents.containsKey(id)) { Runtime.trap("Agent not found") };
    agents.remove(id);
  };

  // Missions CRUD
  public shared ({ caller }) func createMission(
    title : Text,
    department : Text,
    classificationLevel : Text,
    status : Text,
    description : Text,
    assignedAgents : [Nat],
    date : Text,
  ) : async Nat {
    let id = nextMissionId;
    nextMissionId += 1;

    let mission : Mission = {
      id;
      title;
      department;
      classificationLevel;
      status;
      description;
      assignedAgents;
      date;
    };

    missions.add(id, mission);
    id;
  };

  public shared ({ caller }) func updateMission(
    id : Nat,
    title : Text,
    department : Text,
    classificationLevel : Text,
    status : Text,
    description : Text,
    assignedAgents : [Nat],
    date : Text,
  ) : async () {
    switch (missions.get(id)) {
      case (null) { Runtime.trap("Mission not found") };
      case (?_) {
        let updatedMission : Mission = {
          id;
          title;
          department;
          classificationLevel;
          status;
          description;
          assignedAgents;
          date;
        };
        missions.add(id, updatedMission);
      };
    };
  };

  public shared ({ caller }) func deleteMission(id : Nat) : async () {
    if (not missions.containsKey(id)) { Runtime.trap("Mission not found") };
    missions.remove(id);
  };

  // Assets CRUD
  public shared ({ caller }) func createAsset(
    name : Text,
    assetType : Text,
    department : Text,
    status : Text,
    description : Text,
    clearanceLevel : Nat,
  ) : async Nat {
    let id = nextAssetId;
    nextAssetId += 1;

    let asset : Asset = {
      id;
      name;
      assetType;
      department;
      status;
      description;
      clearanceLevel;
    };

    assets.add(id, asset);
    id;
  };

  public shared ({ caller }) func updateAsset(
    id : Nat,
    name : Text,
    assetType : Text,
    department : Text,
    status : Text,
    description : Text,
    clearanceLevel : Nat,
  ) : async () {
    switch (assets.get(id)) {
      case (null) { Runtime.trap("Asset not found") };
      case (?_) {
        let updatedAsset : Asset = {
          id;
          name;
          assetType;
          department;
          status;
          description;
          clearanceLevel;
        };
        assets.add(id, updatedAsset);
      };
    };
  };

  public shared ({ caller }) func deleteAsset(id : Nat) : async () {
    if (not assets.containsKey(id)) { Runtime.trap("Asset not found") };
    assets.remove(id);
  };

  // Most Wanted CRUD
  public shared ({ caller }) func createMostWanted(
    name : Text,
    alias : Text,
    threatLevel : Text,
    lastKnownLocation : Text,
    charges : Text,
    status : Text,
  ) : async Nat {
    let id = nextMostWantedId;
    nextMostWantedId += 1;

    let person : MostWanted = {
      id;
      name;
      alias;
      threatLevel;
      lastKnownLocation;
      charges;
      status;
    };

    mostWanted.add(id, person);
    id;
  };

  public shared ({ caller }) func updateMostWanted(
    id : Nat,
    name : Text,
    alias : Text,
    threatLevel : Text,
    lastKnownLocation : Text,
    charges : Text,
    status : Text,
  ) : async () {
    switch (mostWanted.get(id)) {
      case (null) { Runtime.trap("Most Wanted person not found") };
      case (?_) {
        let updatedPerson : MostWanted = {
          id;
          name;
          alias;
          threatLevel;
          lastKnownLocation;
          charges;
          status;
        };
        mostWanted.add(id, updatedPerson);
      };
    };
  };

  public shared ({ caller }) func deleteMostWanted(id : Nat) : async () {
    if (not mostWanted.containsKey(id)) { Runtime.trap("Most Wanted person not found") };
    mostWanted.remove(id);
  };

  // Public Queries
  public query ({ caller }) func getAllAgents() : async [Agent] {
    let activeAgents = List.empty<Agent>();
    for (agent in agents.values()) {
      switch (agent.status) {
        case (#Banned) {};
        case (#Kicked) {};
        case (_) { activeAgents.add(agent) };
      };
    };
    activeAgents.toArray().sort();
  };

  public query ({ caller }) func getAllMissions() : async [Mission] {
    missions.values().toArray().sort();
  };

  public query ({ caller }) func getAllAssets() : async [Asset] {
    assets.values().toArray().sort();
  };

  public query ({ caller }) func getAllMostWanted() : async [MostWanted] {
    mostWanted.values().toArray().sort();
  };

  public query ({ caller }) func getAgent(id : Nat) : async Agent {
    switch (agents.get(id)) {
      case (null) { Runtime.trap("Agent not found") };
      case (?agent) { agent };
    };
  };

  public query ({ caller }) func getMission(id : Nat) : async Mission {
    switch (missions.get(id)) {
      case (null) { Runtime.trap("Mission not found") };
      case (?mission) { mission };
    };
  };

  public query ({ caller }) func getAsset(id : Nat) : async Asset {
    switch (assets.get(id)) {
      case (null) { Runtime.trap("Asset not found") };
      case (?asset) { asset };
    };
  };

  public query ({ caller }) func getMostWanted(id : Nat) : async MostWanted {
    switch (mostWanted.get(id)) {
      case (null) { Runtime.trap("Most Wanted person not found") };
      case (?person) { person };
    };
  };
};
