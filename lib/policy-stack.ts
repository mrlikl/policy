import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Key } from 'aws-cdk-lib/aws-kms'
import * as s3 from 'aws-cdk-lib/aws-s3'

export class PolicyStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const s3KmsKey = new Key(this, 'TestDataBucketKey')
    const bucket = new s3.Bucket(this, 'TestDataBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: s3KmsKey
    })

    //creates IAM-policy only
    const role_from_name = iam.Role.fromRoleName(this, 'CDKRole', 'cdk-role', {
      mutable: false,
      addGrantsToResources: true
    })
    s3KmsKey.grantEncryptDecrypt(role_from_name)
    bucket.grantReadWrite(role_from_name)

    //creates/appends KMS.KeyPolicy + IAM-Policy
    // const role_from_arn = iam.Role.fromRoleArn(
    //   this,
    //   'CDKRole',
    //   'arn:aws:iam::072179961767:role/cdk-role'
    // )
    // s3KmsKey.grantEncryptDecrypt(role_from_arn)
    // bucket.grantReadWrite(role_from_arn)
  }
}
