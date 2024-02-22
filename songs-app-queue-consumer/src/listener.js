class Listener {
    constructor(songService, mailSender) {
      this._songService = songService;
      this._mailSender = mailSender;
   
      this.listen = this.listen.bind(this);
    }
   
    async listen(message) {
      try {
        const { playlistId, targetEmail } = JSON.parse(message.content.toString());
        
        const notes = await this._songService.getSongs(playlistId);
        const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(notes));
        return result;
      } catch (error) {
        console.error(error);
      }
    }
  }
   
  module.exports = Listener;