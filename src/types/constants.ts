export interface CodesSuccess {
  getAllNotes: "SUCCESS_GET_ALL_NOTES";
  getNote: "SUCCESS_GET_NOTE";
  createNote: "SUCCESS_CREATE_NOTE";
  updateNote: "SUCCESS_UPDATE_NOTE";
  deleteNote: "SUCCESS_DELETE_NOTE";
  healthLive: "SUCCESS_HEALTH_LIVE";
  healthReady: "SUCCESS_HEALTH_READY";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
  foundNote: "NOT_FOUND_NOTE";
  validId: "NOT_VALID_ID";
  validTitle: "NOT_VALID_TITLE";
  validContent: "NOT_VALID_CONTENT";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
}

export interface MessagesSuccess {
  getAllNotes: string;
  getNote: string;
  createNote: string;
  updateNote: string;
  deleteNote: string;
  healthLive: string;
  healthReady: string;
}

export interface MessagesNot {
  foundRoute: string;
  foundNote: string;
  validId: string;
  validTitle: string;
  validContent: string;
}

export interface MessagesError {
  generic: string;
}
