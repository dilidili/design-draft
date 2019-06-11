'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/draft.test.js', () => {
  let projectId = null
  
  it('babel transform react code', function() {
    // create
    return app.httpRequest()
      .post('/api/babel')
      .send({
        code: `
          (function() {
            return (
              <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","margin":null,"width":2344,"height":1530,"background":"rgb(255, 255, 255)"}}>
                <div style={{"display":"flex","flexDirection":"column","alignItems":"center","margin":"0px 0px 0px 0px","width":2303,"height":1486,"background":"rgb(255, 255, 255)"}}>
                  <div style={{"display":"flex","flexDirection":"row","alignItems":"flex-start","margin":"198px 0px 0px 0px","width":951,"height":103,"background":"rgb(255, 255, 255)"}}>
                    <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":99,"height":99,"background":"rgb(175, 211, 169)"}}>
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":39,"height":24,"background":"rgb(122, 182, 111)"}} />
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":36,"height":35,"background":"rgb(122, 182, 111)"}} />
                    </div>
                    <div style={{"display":"flex","flexDirection":"row","alignItems":"flex-start","margin":"0px 0px 0px 31px","width":821,"height":101,"background":"rgb(255, 255, 255)"}}>
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":33,"height":9,"background":"rgb(255, 255, 255)"}} />
                      <div style={{"display":"flex","flexDirection":"row","alignItems":"flex-start","margin":"0px 0px 0px 96px","width":520,"height":24,"background":"rgb(181, 214, 175)"}} />
                    </div>
                  </div>
                  <div style={{"display":"flex","flexDirection":"column","alignItems":"center","margin":"68px 0px 0px 0px","width":1492,"height":759,"background":"rgb(255, 255, 255)"}}>
                    <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":462,"height":79,"background":"rgb(255, 255, 255)"}} />
                    <div style={{"display":"flex","flexDirection":"row","alignItems":"center","margin":"111px 0px 0px 0px","width":1492,"height":153,"background":"rgb(255, 255, 255)"}}>
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":176,"height":64,"background":"rgb(255, 255, 255)"}} />
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","margin":"0px 0px 0px 91px","width":1225,"height":153,"background":"rgb(255, 255, 255)"}} />
                    </div>
                    <div style={{"display":"flex","flexDirection":"row","alignItems":"center","margin":"55px 0px 0px 0px","width":1492,"height":153,"background":"rgb(255, 255, 255)"}}>
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":128,"height":65,"background":"rgb(255, 255, 255)"}} />
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","margin":"0px 0px 0px 139px","width":1225,"height":153,"background":"rgb(255, 255, 255)"}} />
                    </div>
                    <div style={{"display":"flex","flexDirection":"row","alignItems":"center","margin":"55px 0px 0px 0px","width":1492,"height":153,"background":"rgb(255, 255, 255)"}}>
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":224,"height":65,"background":"rgb(255, 255, 255)"}} />
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","margin":"0px 0px 0px 43px","width":1225,"height":153,"background":"rgb(255, 255, 255)"}} />
                    </div>
                  </div>
                  <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","alignSelf":"flex-start","margin":"97px 0px 0px 1797px","width":405,"height":161,"background":"rgb(140, 114, 226)"}}>
                    <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","margin":"0px 0px 0px 0px","width":367,"height":123,"background":"rgb(140, 114, 226)"}}>
                      <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","margin":"0px 0px 0px 0px","width":239,"height":71,"background":"rgb(140, 114, 226)"}} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })();
        `,
      })
      .expect(201)
      .then(response => {
        assert(!!response.body.transformedCode);
      })
  });
});
