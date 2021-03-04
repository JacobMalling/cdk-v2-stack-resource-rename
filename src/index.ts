import * as cdk from '@aws-cdk/core';

/**
 * Interface of operation used to rename stack and its resources
 */
export interface IRenameOperation {
  /**
   * Rename method to rename stack and its resources' custom physical names.
   * AWS generated physical names are not changed.
   * The updated stack name or custom resource's name is returned.
   * @param origVal The original custom physical name.
   * @param typeName The type name of CFN resource.
   */
  rename(origVal: string, typeName: string): string;
}
/**
 * Properties to control rename process.
 */
export interface RenameProps {
  /**
  * Mapping of resourceType names to physicalName fields
  * for resources whose physical names donot follow
  * the regular naming conventions: `${resourceType}`+'Name'
  *
  * @default {}
  */
  readonly irregularResourceNames?: { [key: string]: string };

  /**
  * An array of Resource Types whose custom physical names could not be changed.
  *
  * An empty array will allow the renaming for all resources. A non-empty
  * array will apply rename operation only if the Resource type is not in
  * this array.
  * @default []
  */
  readonly excludeResourceTypes?: string[];

  /**
  * An array of Resource Types whose physical names could be updated.
  *
  * An empty array will not allow any renaming to all resources. A
  * non-empty array will allow renaming only if the Resource type is in
  * this array.
  * @default []
  */
  readonly includeResourceTypes?: string[];
}

/**
 * StackResourceRenamer renames stack name and stack's subordinate resources'
 * custom physical names, so that a CDK stack can be used to create multiple
 * stacks in same AWS environment.
 */
export class StackResourceRenamer implements cdk.IAspect {
  /**
   * Static method to rename a stack and all its subordinate resources.
   * @param stack The stack (and all its children resources) to be renamed.
   * @param renameOper RenameOperation is used to rename
   * stack name and resources' custom physical names. AWS generated
   * physical names are not changed.
   * @param props Properties are set to customize rename operations.
   */
  static rename(stack: cdk.IConstruct, renameOper: IRenameOperation, props: RenameProps = {}) {
    cdk.Aspects.of(stack).add(new StackResourceRenamer(renameOper, props));
  }

  //mapping for resources whose physical names donot follow
  //the regular naming conventions: `${resourceType}`+'Name'
  private irregularNames: { [key: string]: string } = {
    Stack: '_stackName',
    Output: '_exportName',
    ScalingPolicy: 'policyName',
    SlackChannelConfiguration: 'configurationName',
    CompositeAlarm: 'alarmName',
    SecurityGroup: 'groupName',
    DBProxy: 'dbProxyName',
  };
  private includeResTypes: string[] | undefined;
  private excludeResTypes: string[] | undefined;
  private defaultNameField = 'name';
  /**
   * Construct a new StackResourceRenamer.
   * @param renameOper RenameOperation is used to rename
   * stack name and resources' custom physical names. AWS generated
   * physical names are not changed.
   * @param props Properties are set to customize rename operations.
   */
  constructor(private renameOper: IRenameOperation, props: RenameProps = {}) {
    if (props.irregularResourceNames) {
      this.irregularNames = {
        ...this.irregularNames,
        ...props.irregularResourceNames,
      };
    }
    this.excludeResTypes = props.excludeResourceTypes;
    this.includeResTypes = props.includeResourceTypes;
  }
  /**
   * Implement core.IAspect interface
   * @param node CFN resources to be renamed.
   */
  visit(node: cdk.IConstruct): void {
    if (node instanceof cdk.Stack) {
      //rename stack
      this.renameResource(node, 'Stack');
    } else {
      //rename CFN resources
      let ctorName = node.constructor.name;
      //console.log("==", ctorName)
      if (ctorName.startsWith('Cfn')) {
        this.renameResource(node, ctorName.substring(3));
      }
    }
  }
  /**
   * Rename a CFN resource or stack.
   * @param node CFN resource or stack.
   * @param resTypeName The type name of CFN resource.
   */
  protected renameResource(node: cdk.IConstruct, resTypeName: string) {
    //check include/exclude
    if (this.excludeResTypes && this.excludeResTypes.length > 0 &&
      this.excludeResTypes.indexOf(resTypeName) !== -1) {
      return;
    }
    if (this.includeResTypes && this.includeResTypes.length > 0 &&
      this.includeResTypes.indexOf(resTypeName) === -1) {
      return;
    }
    //find the specific "name" field for CFN resources
    let physicalName = 'name';
    if (this.irregularNames[resTypeName]) {
      physicalName = this.irregularNames[resTypeName];
    } else {
      //decapitalize regular resource names
      let [first, ...rest] = resTypeName;
      let decapName = first.toLowerCase() + rest.join('');
      physicalName = `${decapName}Name`;
    }
    if (physicalName.length === 0) {
      return;
    }
    //some protected fields start with underscore
    let underscoreName = '_' + physicalName;
    //rename
    let b = (node as any);
    if (b[physicalName] && b[physicalName].length > 0 && !cdk.Token.isUnresolved(b[physicalName])) {
      b[physicalName] = this.renameOper.rename(b[physicalName], resTypeName);
      //console.log("**** rename: ", b[physicalName]);
    } else if (b[underscoreName] && b[underscoreName].length > 0 && !cdk.Token.isUnresolved(b[underscoreName])) {
      b[underscoreName] = this.renameOper.rename(b[underscoreName], resTypeName);
      //console.log("**** rename: ", b[underscoreName]);
    } else if (b[this.defaultNameField] && b[this.defaultNameField].length > 0 && !cdk.Token.isUnresolved(b[this.defaultNameField])) {
      b[this.defaultNameField] = this.renameOper.rename(b[this.defaultNameField], resTypeName);
      //console.log("**** rename: ", b[this.defaultNameField]);
    }
  }
}
