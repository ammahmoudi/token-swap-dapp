"use client";

import { useAccount, useBalance, useEnsName } from "wagmi";
import { middleEllipsis } from "../utils/middleEllipsis";
import { formatUnits } from "viem";
import { Card, CardBody, Skeleton, Snippet } from "@nextui-org/react";
import Image from "next/image";
import networkIcon from "../icons/network.svg";

export default function Profile() {
	const { address, chain } = useAccount();

	const { data } = useBalance({
		address,
	});

	const ens = useEnsName({
		address,
	});

	return (
		<div className="mb-32 grid gap-4 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
			<Skeleton isLoaded={data != null} className=" rounded-lg">
				<Card className="xl:max-w-sm rounded-xl shadow-lg px-3 w-full">
					<CardBody className="py-5 overflow-hidden">
						<div className="flex gap-2.5">
							<div className="flex ">
								<Image src={networkIcon} height={20} width={20} alt="network" />
								<span className="ml-2"> {chain?.name || ""}</span>
							</div>
						</div>
						<div className="flex gap-2.5 py-2 items-center">
							<span className=" text-xl font-semibold">
								{" "}
								{data ? (
									<p>
										{Number(formatUnits(data.value, data.decimals)).toFixed(4)}{" "}
										{data.symbol}
									</p>
								) : (
									<div />
								)}
							</span>
						</div>
					</CardBody>
				</Card>
			</Skeleton>
			<Skeleton isLoaded={address != null} className=" rounded-lg">
				<Card className="xl:max-w-sm rounded-xl shadow-lg px-3 w-full">
					<CardBody className="py-5 overflow-hidden ">
						<div className="flex gap-2.5">
							<div className="flex ">
								<span>Wallet Address</span>
							</div>
						</div>
						<div className="flex gap-2.5 py-1.5  items-center">
							<Snippet
								symbol=""
								variant="bordered"
								className="py-0 border-0 "
								codeString={address}
							>
								<span className=" text-xl font-semibold">
									{middleEllipsis(address as string, 4) || ""}
								</span>
							</Snippet>
						</div>
					</CardBody>
				</Card>
			</Skeleton>
		</div>
	);
}
