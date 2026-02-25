import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    name : Text;
    department : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type AgentStatus = {
    #Active;
    #Inactive;
    #Banned;
    #Kicked;
    #Redacted;
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

  type Asset = {
    id : Nat;
    name : Text;
    assetType : Text;
    department : Text;
    status : Text;
    description : Text;
    clearanceLevel : Nat;
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

  type Weapon = {
    id : Nat;
    name : Text;
    weaponType : Text;
    department : Text;
    status : Text;
    clearanceLevel : Nat;
    description : Text;
  };

  module Agent {
    public func compare(agent1 : Agent, agent2 : Agent) : Order.Order {
      Text.compare(agent1.codename, agent2.codename);
    };
  };

  module Mission {
    public func compare(mission1 : Mission, mission2 : Mission) : Order.Order {
      Text.compare(mission1.title, mission2.title);
    };
  };

  module Asset {
    public func compare(asset1 : Asset, asset2 : Asset) : Order.Order {
      Text.compare(asset1.name, asset2.name);
    };
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
  var nextWeaponId = 1;

  let agents = Map.empty<Nat, Agent>();
  let missions = Map.empty<Nat, Mission>();
  let assets = Map.empty<Nat, Asset>();
  let mostWanted = Map.empty<Nat, MostWanted>();
  let weapons = Map.empty<Nat, Weapon>();

  // Weapons CRUD
  public shared ({ caller }) func createWeapon(
    name : Text,
    weaponType : Text,
    department : Text,
    status : Text,
    clearanceLevel : Nat,
    description : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create weapons");
    };
    let id = nextWeaponId;
    nextWeaponId += 1;

    let weapon : Weapon = {
      id;
      name;
      weaponType;
      department;
      status;
      clearanceLevel;
      description;
    };

    weapons.add(id, weapon);
    id;
  };

  public query ({ caller }) func getWeapons() : async [Weapon] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view weapons");
    };
    weapons.values().toArray();
  };

  public shared ({ caller }) func updateWeapon(
    id : Nat,
    name : Text,
    weaponType : Text,
    department : Text,
    status : Text,
    clearanceLevel : Nat,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update weapons");
    };
    switch (weapons.get(id)) {
      case (null) { Runtime.trap("Weapon not found") };
      case (?_) {
        let updatedWeapon : Weapon = {
          id;
          name;
          weaponType;
          department;
          status;
          clearanceLevel;
          description;
        };
        weapons.add(id, updatedWeapon);
      };
    };
  };

  public shared ({ caller }) func deleteWeapon(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete weapons");
    };
    if (not weapons.containsKey(id)) { Runtime.trap("Weapon not found") };
    weapons.remove(id);
  };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create agents");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update agents");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can ban agents");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove agents");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create missions");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update missions");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete missions");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create assets");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update assets");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete assets");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create most wanted entries");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update most wanted entries");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete most wanted entries");
    };
    if (not mostWanted.containsKey(id)) { Runtime.trap("Most Wanted person not found") };
    mostWanted.remove(id);
  };

  // Public Queries
  public query ({ caller }) func getAllAgents() : async [Agent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view agents");
    };
    let validAgents = List.empty<Agent>();
    for (agent in agents.values()) {
      switch (agent.status) {
        case (#Banned) {};
        case (#Kicked) {};
        case (_) { validAgents.add(agent) };
      };
    };
    validAgents.toArray().sort();
  };

  public query ({ caller }) func getAllMissions() : async [Mission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view missions");
    };
    missions.values().toArray().sort();
  };

  public query ({ caller }) func getAllAssets() : async [Asset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view assets");
    };
    assets.values().toArray().sort();
  };

  public query ({ caller }) func getAllMostWanted() : async [MostWanted] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view most wanted list");
    };
    mostWanted.values().toArray().sort();
  };

  public query ({ caller }) func getAgent(id : Nat) : async Agent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view agents");
    };
    switch (agents.get(id)) {
      case (null) { Runtime.trap("Agent not found") };
      case (?agent) { agent };
    };
  };

  public query ({ caller }) func getMission(id : Nat) : async Mission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view missions");
    };
    switch (missions.get(id)) {
      case (null) { Runtime.trap("Mission not found") };
      case (?mission) { mission };
    };
  };

  public query ({ caller }) func getAsset(id : Nat) : async Asset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view assets");
    };
    switch (assets.get(id)) {
      case (null) { Runtime.trap("Asset not found") };
      case (?asset) { asset };
    };
  };

  public query ({ caller }) func getMostWanted(id : Nat) : async MostWanted {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view most wanted entries");
    };
    switch (mostWanted.get(id)) {
      case (null) { Runtime.trap("Most Wanted person not found") };
      case (?person) { person };
    };
  };
};
