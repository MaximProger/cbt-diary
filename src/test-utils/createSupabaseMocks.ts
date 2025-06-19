const createSupabaseMocks = (options = {}) => {
  const rangeMock = options.rangeMock || vi.fn().mockResolvedValue(mockResponse);
  const orderMock = options.orderMock || vi.fn().mockReturnValue({ range: rangeMock });
  const selectMock = options.selectMock || vi.fn().mockReturnValue({ order: orderMock });
  const fromMock = options.fromMock || vi.fn().mockReturnValue({ select: selectMock });

  return { rangeMock, orderMock, selectMock, fromMock };
};
