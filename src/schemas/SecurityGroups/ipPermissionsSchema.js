export default {
  beforeSerialize: (data) => {
    // Exclude pk1 and pk2 from data
    const { FromPort, ToPort, IpProtocol } = data;
    const id =
      IpProtocol === "-1"
        ? "all-traffic"
        : `${IpProtocol}-${FromPort}-${ToPort}`;

    // Return data with id
    return {
      ...data,
      id,
    };
  },
};
