import { Construct } from "constructs";
import { App, TerraformStack , TerraformOutput} from "cdktf";
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import * as os from 'os'
import * as fs from 'fs'


// Generate ssh key
// create an Ec2 keypair
// create an Ec2 instance
class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, id: name); 

    const keyPath : string = os.homedir() + '/.ssh/id_rsa.pub'
    const publicKey = fs.readFileSync(keyPath, 'utf-8')
  
    new AwsProvider(this,'AWS', {
      region: "us-east-1",
    });

    const KeyPair = new Instance.keyPair(this, 'keypair', {
      publicKey,
      keyName: "CDKTF-KEY"
    })

    const ec2Instance = new Instance(this, 'compute', {
      ami: 'ami-053b0d53c279acc90', 
      instanceType: 't2.micro',
      keyName: KeyPair.keyName
    }) 

    new TerraformOutput(this, 'public_ip', {
      value: instance.publicIp
    })

    // define resources here
  }
}

const app = new App();
new MyStack(app, "aws-terracofee");
app.synth();
