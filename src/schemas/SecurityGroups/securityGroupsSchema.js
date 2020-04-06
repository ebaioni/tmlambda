export default {
  id: "GroupId",
  links: {
    self(data) {
      return `/securityGroups/${data.GroupId}`;
    },
  },
  relationships: {
    IpPermissions: {
      type: "ipPermissions",
      links(data) {
        return {
          self: `/securityGroups/${data.GroupId}/relationships/ipPermissions`,
          related: `/securityGroups/${data.GroupId}/ipPermissions`,
        };
      },
    },
    IpPermissionsEgress: {
      type: "ipPermissionsEgress",
      links(data) {
        return {
          self: `/securityGroups/${data.GroupId}/relationships/ipPermissionsEgress`,
          related: `/securityGroups/${data.GroupId}/ipPermissionsEgress`,
        };
      },
    },
    Tags: {
      type: "tag",
    },
  },
  topLevelMeta(data) {
    return {
      total: data.length,
    };
  },
};
